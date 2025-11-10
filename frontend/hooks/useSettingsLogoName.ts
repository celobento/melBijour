import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';

const useSettingsLogoName = () => {
    //initiate the company name from .env APP_NAME
    const [companyName, setCompanyName] = useState(process.env.APP_NAME || "Mel Bijour");
    const [companyLogo, setCompanyLogo] = useState<string | null>(process.env.APP_LOGO || null);
    const fetchSettings = async () => {
        try {
          const response = await axiosInstance.get("/settings/logo-name");
          setCompanyName(response.data.companyName || process.env.APP_NAME || "Mel Bijour");
          setCompanyLogo(response.data.logo || process.env.APP_LOGO || null);
        } catch (error) {
          console.error("Error fetching data logo and name:", error);
        }
      };
    
      useEffect(() => {
        fetchSettings();
      }, [fetchSettings]);

  return {
    companyName,
    companyLogo,
  }
}

export default useSettingsLogoName