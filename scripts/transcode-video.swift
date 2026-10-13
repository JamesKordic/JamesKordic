import AVFoundation
import Foundation

// Web export for the portfolio's landscape case-study film. Source media is read only.
guard CommandLine.arguments.count == 3 else {
    fputs("Usage: swift transcode-video.swift SOURCE OUTPUT\n", stderr)
    exit(1)
}

func fail(_ message: String) -> Never {
    fputs("\(message)\n", stderr)
    exit(1)
}

let sourceURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
guard sourceURL.standardizedFileURL != outputURL.standardizedFileURL else {
    fail("Source and output must be different files.")
}
guard !FileManager.default.fileExists(atPath: outputURL.path) else {
    fail("Output already exists; choose a new temporary filename.")
}

let asset = AVURLAsset(url: sourceURL)
guard let videoTrack = asset.tracks(withMediaType: .video).first else {
    fail("The source has no video track.")
}

do {
    let reader = try AVAssetReader(asset: asset)
    let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true

    let videoOutput = AVAssetReaderTrackOutput(track: videoTrack, outputSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
    ])
    videoOutput.alwaysCopiesSampleData = false
    let videoInput = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: 1280,
        AVVideoHeightKey: 720,
        AVVideoScalingModeKey: AVVideoScalingModeResizeAspect,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: 2_500_000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoMaxKeyFrameIntervalKey: 60,
        ],
    ])
    videoInput.expectsMediaDataInRealTime = false
    videoInput.transform = videoTrack.preferredTransform
    guard reader.canAdd(videoOutput), writer.canAdd(videoInput) else {
        fail("Unable to configure H.264 video encoding.")
    }
    reader.add(videoOutput)
    writer.add(videoInput)

    var pairs: [(AVAssetReaderOutput, AVAssetWriterInput)] = [(videoOutput, videoInput)]
    if let audioTrack = asset.tracks(withMediaType: .audio).first {
        let audioOutput = AVAssetReaderTrackOutput(track: audioTrack, outputSettings: [
            AVFormatIDKey: kAudioFormatLinearPCM,
        ])
        let audioInput = AVAssetWriterInput(mediaType: .audio, outputSettings: [
            AVFormatIDKey: kAudioFormatMPEG4AAC,
            AVEncoderBitRateKey: 128_000,
            AVSampleRateKey: 44_100,
            AVNumberOfChannelsKey: 2,
        ])
        audioInput.expectsMediaDataInRealTime = false
        guard reader.canAdd(audioOutput), writer.canAdd(audioInput) else {
            fail("Unable to configure AAC audio encoding.")
        }
        reader.add(audioOutput)
        writer.add(audioInput)
        pairs.append((audioOutput, audioInput))
    }

    guard writer.startWriting(), reader.startReading() else {
        fail("Unable to start transcoding: \(String(describing: writer.error ?? reader.error))")
    }
    writer.startSession(atSourceTime: .zero)

    let group = DispatchGroup()
    for (index, pair) in pairs.enumerated() {
        let (output, input) = pair
        group.enter()
        let queue = DispatchQueue(label: "portfolio.transcode.\(index)")
        var finished = false
        input.requestMediaDataWhenReady(on: queue) {
            guard !finished else { return }
            while input.isReadyForMoreMediaData {
                guard let sample = output.copyNextSampleBuffer() else {
                    finished = true
                    input.markAsFinished()
                    group.leave()
                    return
                }
                guard input.append(sample) else {
                    finished = true
                    input.markAsFinished()
                    group.leave()
                    return
                }
            }
        }
    }
    guard group.wait(timeout: .now() + 180) == .success else {
        reader.cancelReading()
        writer.cancelWriting()
        fail("Video encoding timed out.")
    }
    guard reader.status == .completed else {
        writer.cancelWriting()
        fail("Could not read the complete source: \(String(describing: reader.error ?? writer.error))")
    }
    let completion = DispatchSemaphore(value: 0)
    writer.finishWriting { completion.signal() }
    completion.wait()
    guard writer.status == .completed else {
        fail("Could not finish the web video: \(String(describing: writer.error))")
    }

    let exported = AVURLAsset(url: outputURL)
    guard let exportedTrack = exported.tracks(withMediaType: .video).first,
          exportedTrack.naturalSize == CGSize(width: 1280, height: 720),
          abs(exported.duration.seconds - asset.duration.seconds) < 0.1 else {
        fail("Export validation failed: dimensions or duration changed unexpectedly.")
    }
    let bytes = try FileManager.default.attributesOfItem(atPath: outputURL.path)[.size] as! UInt64
    guard bytes > 0, bytes <= 25 * 1024 * 1024 else {
        fail("Export is \(bytes) bytes, exceeding the 25 MiB hosting limit.")
    }
    print("H.264 web export: 1280×720, \(exported.duration.seconds) seconds, \(bytes) bytes.")
} catch {
    fail("Transcoding failed: \(error)")
}
