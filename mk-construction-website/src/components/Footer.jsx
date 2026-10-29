import { company } from "../data";
import useWebsiteData from "../hooks/useWebsiteData";

export default function Footer() {
  const { data } = useWebsiteData();

  const siteName = data?.companyName || company.name;
  const siteAddress = data?.address || company.address;
  const sitePhone = data?.phone || company.phone;
  const siteEmail = data?.email || company.email;

  return (
    <footer className="bg-navy-dark px-6 py-10 text-sm text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6">
        <div>
          <p className="mb-1 font-heading text-base font-bold text-white">{siteName}</p>
          <p>{siteAddress}</p>
        </div>
        <div>
          <p>{sitePhone}</p>
          <p>{siteEmail}</p>
        </div>
        <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
}