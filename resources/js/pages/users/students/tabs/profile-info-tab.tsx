
import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Camera, Check, Image, ImageOffIcon, Trash2, Upload, UserCircle2Icon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import CaptureImageDialog from '../capture-dialog';
import { Badge } from '@/components/ui/badge';

interface ProfileInfoTabProps {
    data?: {
        first_name?: string;
        other_names?: string;
        sir_name?: string;
        date_of_birth?: Date;
        gender?: string;
        profile_photo?: File | null;
    };
    onChange?: (field: string, value: any) => void;
}

export default function ProfileInfoTab({
    data = {},
    onChange,
}: ProfileInfoTabProps) {
    const [showWebcam, setShowWebcam] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: any) => {
        if (onChange) {
            onChange(field, value);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            handleChange('profile_photo', file);
            setCapturedImage(null);
        }
    };

    const captureImage = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);

            // Convert base64 to File object
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File(
                        [blob],
                        `webcam-capture-${Date.now()}.jpg`,
                        {
                            type: 'image/jpeg',
                        },
                    );
                    handleChange('profile_photo', file);
                });
        }
    };

    const retakeImage = () => {
        setCapturedImage(null);
    };

    const acceptCapturedImage = () => {
        setShowWebcam(false);
    };

    const openWebcamDialog = () => {
        setCapturedImage(null);
        setShowWebcam(true);
    };

    const deleteImage = () => {
        setCapturedImage(null);
    }

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: 'user',
    };

    

    // Cleanup webcam on unmount
    useEffect(() => {
        return () => {
            if (showWebcam) {
                setShowWebcam(false);
            }
        };
    }, [showWebcam]);

    return (
        <div className="space-y-6">
            <FormSection
                title="Student Profile Information"
                Icon={{ icon: UserCircle2Icon, color: 'green-500' }}
                description="Basic personal details of the student"
                border={false}
                spacing="lg"
            >
                <FormGrid cols={2} gap="md">
                    <FormField
                        name="sir_name"
                        label="Sir Name"
                        value={data.sir_name || ''}
                        onChange={handleChange}
                        required={true}
                        placeholder="Enter sir name"
                        containerClassName="space-y-2"
                        inputClassName=""
                    />

                    <FormField
                        name="first_name"
                        label="First Name"
                        value={data.first_name || ''}
                        onChange={handleChange}
                        required={true}
                        placeholder="Enter first name"
                        containerClassName="space-y-2"
                        inputClassName="focus:border-primary"
                    />
                </FormGrid>

                <FormGrid cols={2} gap="md">
                    <FormField
                        name="other_names"
                        label="Other Names"
                        value={data.other_names || ''}
                        onChange={handleChange}
                        required
                        placeholder="Enter other names"
                        containerClassName="space-y-2"
                        inputClassName="focus:border-primary"
                    />

                    <FormField
                        name="gender"
                        label="Gender"
                        type="select"
                        value={data.gender || ''}
                        onChange={handleChange}
                        required={true}
                        placeholder="Select gender"
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' },
                        ]}
                        containerClassName="space-y-2"
                        inputClassName="focus:border-primary"
                    />
                </FormGrid>
            </FormSection>

            <FormSection
                title="Additional Information"
                description="Date of birth and profile photo"
                border={false}
                spacing="lg"
            >
                <FormGrid cols={2} gap="md">
                    <FormField
                        name="date_of_birth"
                        label="Date Of Birth"
                        value={data.date_of_birth || ''}
                        onChange={handleChange}
                        required
                        placeholder="Pick a date"
                        type='calendar'
                    />
                    

                    <div className="space-y-2 rounded border p-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Profile Photo
                                <span className="ml-1 text-xs text-gray-500">
                                    (Optional)
                                </span>
                            </label>
                            <Dialog
                                open={showWebcam}
                                onOpenChange={setShowWebcam}
                            >
                                {/* <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={openWebcamDialog}
                                        className="gap-2"
                                        size="sm"
                                    >
                                        <Camera className="h-4 w-4" />
                                        Take Photo
                                    </Button>
                                </DialogTrigger> */}
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Take Profile Photo
                                        </DialogTitle>
                                        <DialogDescription>
                                            Position your face in the center and
                                            ensure good lighting.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <CaptureImageDialog
                                        acceptCapturedImage={
                                            acceptCapturedImage
                                        }
                                        captureImage={captureImage}
                                        retakeImage={retakeImage}
                                        capturedImage={capturedImage}
                                        videoConstraints={videoConstraints}
                                        webcamRef={webcamRef}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                                    {data.profile_photo || capturedImage ? (
                                        <img
                                            src={
                                                capturedImage ||
                                                URL.createObjectURL(
                                                    data.profile_photo!,
                                                )
                                            }
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <ImageOffIcon className="mx-auto h-10 w-10" />
                                        </div>
                                    )}
                                    {capturedImage != null && (
                                        <Badge
                                            onClick={deleteImage}
                                            className="absolute top-3 -right-0.5 bg-red-500 p-0.5"
                                        >
                                            <X className="" />{' '}
                                        </Badge>
                                    )}

                                    <div className="absolute -bottom-0.5 flex">
                                        <Badge
                                            onClick={openWebcamDialog}
                                            className="relative -left-4 rounded-full bg-green-500 p-0.5"
                                        >
                                            <Camera className="" />{' '}
                                        </Badge>
                                        <Badge
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="relative -right-4 rounded-full bg-blue-500 p-0.5"
                                        >
                                            {' '}
                                            <Upload className="" />{' '}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <input
                                        ref={fileInputRef}
                                        id="profile_photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="space-y-1 text-xs text-gray-500">
                                    <p>• Recommended: Square image, max 2MB</p>
                                    <p>• File types: JPG, PNG, WebP</p>
                                    <p>
                                        • Ensure face is clearly visible and
                                        well-lit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FormGrid>
            </FormSection>
        </div>
    );
}
