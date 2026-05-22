import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiKey, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  resetAdminPasswordSchema,
  type ResetAdminPasswordSchemaType,
} from "../schemas/admin.schema";
import type { AdminEntity, ResetAdminPasswordForm } from "../types/admin.types";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <FiAlertCircle className="text-rose-500 text-xs shrink-0" />
      <p className="text-xs text-rose-500 font-medium">{message}</p>
    </div>
  );
};

interface AdminResetPasswordSheetProps {
  admin: AdminEntity | null;
  isSubmitting: boolean;
  onSubmit: (data: ResetAdminPasswordForm) => void;
  onCancel: () => void;
}

const AdminResetPasswordSheet = ({
  admin,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminResetPasswordSheetProps) => {
  const open = !!admin;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ResetAdminPasswordSchemaType>({
    resolver: zodResolver(resetAdminPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => reset(), 300);
      return () => clearTimeout(t);
    }
  }, [open, reset]);

  const onFormSubmit = handleSubmit((data) => onSubmit(data));

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => (!o ? handleCancel() : null)}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-border bg-card"
      >
        <SheetHeader className="px-8 pt-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100
                         dark:bg-amber-950/40 dark:border-amber-900/60
                         flex items-center justify-center"
            >
              <FiKey className="text-amber-600 dark:text-amber-300 text-lg" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold tracking-widest uppercase text-amber-700 dark:text-amber-300">
                Reset Password
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-sm mt-0.5">
                {admin
                  ? `Set a new password for ${admin.username}`
                  : "Set a new password"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={onFormSubmit}
          className="flex flex-col h-[calc(100%-88px)]"
        >
          <div className="px-8 py-7 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                New password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                {...register("password")}
                aria-invalid={!!errors.password}
                className="h-11 rounded-xl bg-muted/40 text-foreground border-border"
              />
              <FieldError message={errors.password?.message} />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter the password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className="h-11 rounded-xl bg-muted/40 text-foreground border-border"
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>
          </div>

          <SheetFooter className="px-8 py-6 border-t border-border flex flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
              className="h-11 px-6 rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 gap-2 min-w-40"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin text-base" />
                  Saving…
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AdminResetPasswordSheet;
