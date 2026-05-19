import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description?: string;
};

export const SEO = ({ title, description }: SEOProps) => {
  const defaultTitle = "Exopy";
  const fullTitle = `${title} | ${defaultTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      {description && (
        <meta name="description" content={description} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && (
        <meta property="og:description" content={description} />
      )}
    </Helmet>
  );
};