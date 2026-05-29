import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PageTemplateProps = {
  title: string;
};

const PageTemplate = ({ title }: PageTemplateProps) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl overflow-hidden border shadow-sm">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-primary" />

        <CardHeader className="space-y-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Construction className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              {/* Badge */}
              <Badge
                variant="outline"
                className="border-primary text-primary"
              >
                Under Construction
              </Badge>

              {/* Title & Description */} 
              <div>
                <CardTitle className="">
                  {title}
                </CardTitle>
                <CardDescription className="mt-1">
                  This page is currently being prepared.
                </CardDescription> 
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground flex flex-col items-center justify-center">
          <p>
            This is the{" "}
            <span className="font-medium text-foreground">{title}</span> page.
            Content will go here.
          </p>
          <p>
            We're still working on this section and will add the final content
            soon.
          </p>
        </CardContent>

        <CardFooter className="border-t ">
          <p className="text-xs text-muted-foreground text-center w-full">
            Exopy &copy; 2026. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PageTemplate;    