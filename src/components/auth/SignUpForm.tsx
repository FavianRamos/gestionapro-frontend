import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { API_URL } from "../../config/api";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        const message =
          errorData?.details?.[0] ||
          errorData?.message ||
          "Failed to register the user";

        throw new Error(message);
      }

      const data = await response.json();

      // Save token and username after successful registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      // Registered users default to USER role
      navigate("/home");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign Up
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a username and password to sign up
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <Label>
                  Username
                  <span className="text-error-500">
                    *
                  </span>
                </Label>

                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>
                  Password
                  <span className="text-error-500">
                    *
                  </span>
                </Label>

                <div className="relative">
                  <Input
                    placeholder="At least 6 characters"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <span
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={loading}
                >
                  {loading
                    ? "Signing up..."
                    : "Sign Up"}
                </Button>
              </div>

            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}