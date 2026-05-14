import { Skeleton } from "@/components/ui/skeleton";

export function LoginSessionSkeleton() {
  return (
    <>
      <span className="sr-only">Loading</span>
      <div className="auth-layout" aria-busy="true">
        <Skeleton
          className="auth-layout__logo"
          aria-hidden
        />
        <div className="auth-layout__intro">
          <Skeleton className="h-3 w-24" aria-hidden />
          <Skeleton
            className="h-7 w-full max-w-48"
            aria-hidden
          />
          <Skeleton
            className="h-10 w-full max-w-72"
            aria-hidden
          />
        </div>
        <div className="auth-layout__form-slot w-full max-w-88">
          <Skeleton className="h-10 w-full" aria-hidden />
          <Skeleton className="h-10 w-full" aria-hidden />
          <Skeleton
            className="h-9 w-full max-w-32"
            aria-hidden
          />
        </div>
      </div>
    </>
  );
}
