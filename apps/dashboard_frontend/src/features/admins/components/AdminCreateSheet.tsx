import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUserPlus, FiLoader, FiAlertCircle } from "react-icons/fi";
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
  createAdminSchema,
  type CreateAdminSchemaType,
} from "../schemas/admin.schema";
import type { CreateAdminForm } from "../types/admin.types";
import type { IOrganization } from "@/store/slice/organization/organization.slice";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <FiAlertCircle className="text-rose-500 text-xs shrink-0" />
      <p className="text-xs text-rose-500 font-medium">{message}</p>
    </div>
  );
};

interface AdminCreateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: IOrganization[];
  isSubmitting: boolean;
  onSubmit: (data: CreateAdminForm) => void;
}

const AdminCreateSheet = ({
  open,
  onOpenChange,
  organizations,
  isSubmitting,
  onSubmit,
}: AdminCreateSheetProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAdminSchemaType>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { username: "", email: "", password: "", org_id: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => reset(), 300);
      return () => clearTimeout(t);
    }
  }, [open, reset]);

  const onFormSubmit = handleSubmit((data) => onSubmit(data));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 border-l border-border bg-card"
      >
        <SheetHeader className="px-8 pt-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100
                         dark:bg-teal-950/40 dark:border-teal-900/60
                         flex items-center justify-center"
            >
              <FiUserPlus className="text-teal-600 dark:text-teal-300 text-lg" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold tracking-widest uppercase text-teal-700 dark:text-teal-300">
                Create Admin
              </SheetTitle>
              <SheetDescription className="text-muted-foreground text-sm mt-0.5">
                Assign an admin to an organization
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
                htmlFor="username"
                className="text-sm font-semibold text-foreground"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                {...register("username")}
                aria-invalid={!!errors.username}
                className="h-11 rounded-xl bg-muted/40 text-foreground border-border"
              />
              <FieldError message={errors.username?.message} />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@email.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-11 rounded-xl bg-muted/40 text-foreground border-border"
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Password
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
                htmlFor="org_id"
                className="text-sm font-semibold text-foreground"
              >
                Organization
              </label>
              <select
                id="org_id"
                {...register("org_id")}
                className="h-11 w-full px-4 rounded-xl bg-muted/40 text-foreground border border-border outline-none"
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.org_id?.message} />
            </div>
          </div>

          <SheetFooter className="px-8 py-6 border-t border-border flex flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="h-11 px-6 rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 gap-2 min-w-40"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin text-base" />
                  Creating…
                </>
              ) : (
                "Create Admin"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AdminCreateSheet;
