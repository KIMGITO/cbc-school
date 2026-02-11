import FormField from '@/components/custom/form-field';
import FormGrid from '@/components/custom/form-grid';
import FormSection from '@/components/custom/form-section';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useStudentAdmission } from '@/hooks/use-student-admission';
import { Camera, ImageOffIcon, Upload, UserCircle2Icon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import CaptureImageDialog from '../capture-dialog';

export default function ProfileInfoTab() {
    const {
        formData,
        formDataErrors,
        updateFormField,
        activeTab,
        goToNextTab,
        validateCurrentTab,
    } = useStudentAdmission();

    const [showWebcam, setShowWebcam] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: any) => {
        updateFormField(field as keyof typeof formData, value);
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
        handleChange('profile_photo', null);
        setCapturedImage(null);
    };

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: 'user',
    };

    const handleNext = () => {
        if (validateCurrentTab()) {
            goToNextTab();
        }
    };

    // Cleanup webcam on unmount
    useEffect(() => {
        return () => {
            if (showWebcam) {
                setShowWebcam(false);
            }
        };
    }, [showWebcam]);

    // Get image URL for preview
    const getImagePreviewUrl = () => {
        if (capturedImage) {
            return capturedImage;
        }
        if (formData.profile_photo instanceof File) {
            return URL.createObjectURL(formData.profile_photo);
        }
        return null;
    };

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
                        error={formDataErrors.sir_name}
                        name="sir_name"
                        label="Sir Name"
                        value={formData.sir_name || ''}
                        onChange={handleChange}
                        required={true}
                        placeholder="Enter sir name"
                        containerClassName="space-y-2"
                        inputClassName=""
                    />

                    <FormField
                        error={formDataErrors.first_name}
                        name="first_name"
                        label="First Name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        required={true}
                        placeholder="Enter first name"
                        containerClassName="space-y-2"
                        inputClassName="focus:border-primary"
                    />
                </FormGrid>

                <FormGrid cols={2} gap="md">
                    <FormField
                        error={formDataErrors.other_names}
                        name="other_names"
                        label="Other Names"
                        value={formData.other_names || ''}
                        onChange={handleChange}
                        required
                        placeholder="Enter other names"
                        containerClassName="space-y-2"
                        inputClassName="focus:border-primary"
                    />

                    <FormField
                        error={formDataErrors.gender}
                        name="gender"
                        label="Gender"
                        type="select"
                        value={formData.gender || ''}
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
                        error={formDataErrors.date_of_birth}
                        name="date_of_birth"
                        label="Date Of Birth"
                        value={formData.date_of_birth || ''}
                        onChange={handleChange}
                        required
                        placeholder="Pick a date"
                        type="calendar-enhanced"
                    />

                    <div
                        className={`space-y-2 rounded border p-2 ${formDataErrors.profile_photo ? 'border-red-500' : ''}`}
                    >
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
                                    {getImagePreviewUrl() ? (
                                        <img
                                            src={getImagePreviewUrl()!}
                                            alt="Profile preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <ImageOffIcon className="mx-auto h-10 w-10" />
                                        </div>
                                    )}
                                    {getImagePreviewUrl() && (
                                        <Badge
                                            onClick={deleteImage}
                                            className="absolute top-3 -right-0.5 cursor-pointer bg-red-500 p-0.5"
                                        >
                                            <X className="" />{' '}
                                        </Badge>
                                    )}

                                    <div className="absolute -bottom-0.5 flex">
                                        <Badge
                                            onClick={openWebcamDialog}
                                            className="relative -left-4 cursor-pointer rounded-full bg-green-500 p-0.5"
                                        >
                                            <Camera className="" />{' '}
                                        </Badge>
                                        <Badge
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="relative -right-4 cursor-pointer rounded-full bg-blue-500 p-0.5"
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

                                {formDataErrors.profile_photo ? (
                                    <InputError
                                        message={formDataErrors.profile_photo}
                                    />
                                ) : (
                                    <div className="space-y-1 text-xs text-gray-500">
                                        <p>
                                            • Recommended: Square image, max 2MB
                                        </p>
                                        <p>• File types: JPG, PNG, WebP</p>
                                        <p>
                                            • Ensure face is clearly visible and
                                            well-lit
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </FormGrid>
            </FormSection>

            {/* Navigation buttons */}
            <div className="flex justify-end gap-4 border-t pt-4">
                <Button
                    variant="outline"
                    onClick={handleNext}
                    size="lg"
                    className="px-8"
                >
                    Continue to Address Info →
                </Button>
            </div>
        </div>
    );
}
