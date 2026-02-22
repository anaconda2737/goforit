import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthContext as AuthContextType,
  User,
  Register,
  Login,
} from "types/Auth";
import { cookie } from "utils";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { loginUser, registerUser } from "services/User";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  let [user, setUser] = useState<User | null>(null);

  let [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const redirectUrl = searchParams?.get("url");

  const router = useRouter();

  useEffect(() => {
    document.addEventListener("unauthorized", logout);
    getUser();
    return () => document.removeEventListener("unauthorized", logout);
  }, []);

  const getUser = (): void => {
    let token = cookie.get("auth_token");
    if (token) {
      let decoded = jwtDecode<User>(token);
      setUser(decoded);
    }
    if (isLoading) setIsLoading(false);
  };

  const login: Login = async (data) => {
    try {
      let {
        data: { token },
      } = await loginUser(data);
      cookie.set({ name: "auth_token", days: 7, value: token });
      let decoded = jwtDecode<User>(token);
      setUser(decoded);
      router.replace(
        (pathname || "").startsWith("/auth")
          ? redirectUrl || "/form/list"
          : pathname || "/form/list"
      );
    } catch (error: any) {
      if (error?.message === "User not exist") {
        router.replace(
          `/auth/register${redirectUrl ? `?url=${redirectUrl}` : ""}`
        );
      }
    }
  };

  const register: Register = async (data) => {
    let {
      data: { token },
    } = await registerUser(data);
    cookie.set({ name: "auth_token", days: 7, value: token });
    let decoded = jwtDecode<User>(token);
    setUser(decoded);
    router.replace(redirectUrl || "/form/list");
  };

  const logout = () => {
    document.title = "Goforit";
    let root = document.querySelector("html");
    if (root) root.removeAttribute("style");
    cookie.remove("auth_token");
    setUser(null);
    router.replace("/auth/login");
  };

  let context = { user, isLoading, setUser, login, register, logout };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
