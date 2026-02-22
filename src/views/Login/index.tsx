import { Fragment, useEffect } from "react";
import Input from "components/Input";
import useForm from "hooks/useForm";
import useAuth from "hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { cookie } from "utils";

import styles from "./Login.module.scss";

const Login = () => {
  const { login } = useAuth();

  const { register, handleSubmit, formErrors } = useForm<{
    email: string;
    password: string;
  }>();

  const router = useRouter();
  const searchParams = useSearchParams();

  let url = searchParams?.get("url");

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") handleSubmit(login)(event);
  };

  useEffect(() => {
    if (cookie.get("auth_token")) {
      router.replace(url || "/form/list");
    }
  }, [router, url]);

  if (cookie.get("auth_token")) return null;

  return (
    <Fragment>
      <div className={styles.header}>
        <span>Sign In</span>
      </div>
      <div className={styles.container}>
        <div>
          <div className={styles.field}>
            <label>Email Id</label>
            <Input
              placeholder="Enter email id"
              register={register("email", {
                required: {
                  value: true,
                  message: "Please enter email id",
                },
                pattern: {
                  value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Invalid Email",
                },
              })}
            />
          </div>
          {formErrors?.email && (
            <span className={styles.error_msg}>{formErrors.email}</span>
          )}
        </div>
        <div>
          <div className={styles.field}>
            <label>Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              register={register("password", {
                required: { value: true, message: "Please enter password" },
              })}
            />
          </div>
          {formErrors?.password && (
            <span className={styles.error_msg}>{formErrors.password}</span>
          )}
        </div>
        <div className={styles.cta}>
          <button onClick={handleSubmit(login)}>Login</button>
          <span>
            Dont't have an account ? &nbsp;
            <span onClick={() => router.push("/auth/register")}>Sign Up Here</span>
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
