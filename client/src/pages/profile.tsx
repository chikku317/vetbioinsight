import { ProfileForm } from "@/components/auth/profile-form";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Account Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your profile information and security settings
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  );
}