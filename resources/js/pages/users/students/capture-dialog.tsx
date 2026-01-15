import { Button } from '@/components/ui/button';
import { DialogHeader } from '@/components/ui/dialog';
import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@radix-ui/react-dialog';
import { Camera, Check, X } from 'lucide-react';
import { RefObject } from 'react';
import Webcam from 'react-webcam';

export default function CaptureImageDialog({
    capturedImage,
    webcamRef,
    videoConstraints,
    retakeImage,
    captureImage,
    acceptCapturedImage,
}: {
    capturedImage: string | null;
    webcamRef: RefObject<Webcam | null>;
    videoConstraints: {
        width: number;
        height: number;
        facingMode: string;
    };
    retakeImage: () => void;
    captureImage: () => void;
    acceptCapturedImage: () => void;
}) {
    return (

        <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-900">
                {!capturedImage ? (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="h-auto w-full"
                    />
                ) : (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="h-auto w-full"
                    />
                )}
            </div>

            <div className="flex justify-center gap-3">
                {!capturedImage ? (
                    <Button
                        type="button"
                        onClick={captureImage}
                        className="gap-2"
                    >
                        <Camera className="h-4 w-4" />
                        Capture Photo
                    </Button>
                ) : (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={retakeImage}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Retake
                        </Button>
                        <Button
                            type="button"
                            onClick={acceptCapturedImage}
                            className="gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Use Photo
                        </Button>
                    </>
                )}
            </div>
        </div>);
}
