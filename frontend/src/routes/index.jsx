import Loading from "@/components/shared/loading";
import RootLayout from "@/layouts/root-layout";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
const HomePage = lazy(() => import("@/app/home"));
const SignUpPage = lazy(() => import("@/app/sign-up"));
const ErrorPage = lazy(() => import("@/app/not-found"));

const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Root layout */}
          <Route
            element={
            //   <ProtectedRoute>
                <RootLayout />
            //   </ProtectedRoute>
            }
          >
            <Route
              index
              element={<HomePage />}
            />
          
          </Route>
          {/* Authentication routes */}
     {/*      <Route
            path="/sign-in"
            element={<SignInPage />}
          /> */}
          <Route
            path="/sign-up"
            element={<SignUpPage />}
          />
          {/* <Route
            path="/forget-password"
            element={<ForgetPasswordPage />}
          />
          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/forget-password-message"
            element={<ForgetPasswordMessagePage />}
          /> */}
          {/* Catch-all for 404 */}
          <Route
            path="*"
            element={<ErrorPage />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default RouterProvider;
