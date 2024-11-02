import { useEffect } from "react";
import Modal from "react-modal";
import { Auth } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../../utils/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../../../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export default function AuthModal({ isOpen, onRequestClose }: AuthModalProps) {
  const { user } = useAuth();

  // close the modal if the user is already logged in
  useEffect(() => {
    if (user) {
      onRequestClose();
    }
  }, [user, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white w-full max-w-md mx-auto mt-24 p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
        />
      </div>
    </Modal>
  );
}
