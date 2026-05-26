import { useSiteContent } from './useSiteContent'
import { firm as staticFirm, socialLinks as staticSocialLinks } from '../data/site'

export type ContactInfo = {
  phone: string
  fax: string
  email: string
  secondEmail: string
  address: string
  socialLinks: {
    facebook: string
    instagram: string
    tiktok: string
    linkedin: string
  }
}

const staticDefaults: ContactInfo = {
  phone: staticFirm.phone,
  fax: '973-474-1005',
  email: staticFirm.email,
  secondEmail: 'Receptionist@ibezimlaw.com',
  address: staticFirm.address,
  socialLinks: {
    facebook: staticSocialLinks.facebook,
    instagram: staticSocialLinks.instagram,
    tiktok: staticSocialLinks.tiktok,
    linkedin: staticSocialLinks.linkedin,
  },
}

export function useContactInfo(): ContactInfo {
  const dynamic = useSiteContent<Partial<ContactInfo>>('otherInfo', {})

  return {
    ...staticDefaults,
    ...dynamic,
    socialLinks: {
      ...staticDefaults.socialLinks,
      ...(dynamic.socialLinks || {}),
    },
  }
}