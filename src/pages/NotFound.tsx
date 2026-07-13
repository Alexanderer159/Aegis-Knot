import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4 text-xl text-foreground">Page not found</p>
        <a href="/" className="text-primary">Return Home</a>
      </div>
    </div>
  );
};

export default NotFound;
