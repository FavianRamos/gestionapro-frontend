import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { API_URL } from "../../config/api";

export default function SignInForm() {
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
        `${API_URL}/api/auth/login`,
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
        throw new Error("Incorrect username or password");
      }

      const data = await response.json();

      // Save token and username after a successful login
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);

      // Decode the JWT
      const payload = JSON.parse(
        atob(data.token.split(".")[1])
      );

      console.log("JWT payload:", payload);

      // Redirect based on role
      if (payload.role === "ADMIN") {
        navigate("/");
      } else {
        navigate("/inicio");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sign in"
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
            Sign In
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your username and password to sign in!
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <Label>
                  Username{" "}
                  <span className="text-error-500">*</span>
                </Label>

                <Input
                  placeholder="favian"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>
                  Password{" "}
                  <span className="text-error-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
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
                    ? "Signing in..."
                    : "Sign in"}
                </Button>
              </div>

            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}