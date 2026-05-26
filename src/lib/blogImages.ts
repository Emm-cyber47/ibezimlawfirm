import officeImg from '../office.jpg'
import doorImg from '../door.jpg'
import receptionImg from '../reception.jpg'
import outdoorImg from '../officeoutdoor.jpeg'


export const blogImages = {
  office: officeImg,
  door: doorImg,
  reception: receptionImg,
  officeoutdoor: outdoorImg,
} as const

// export type BlogImageKey = (typeof blogPosts)[number]['imageKey']
export type BlogImageKey =
  | 'office'
  | 'door'
  | 'reception'
  | 'officeoutdoor'

// export function getBlogImage(imageKey: BlogImageKey) {
//   return blogImages[imageKey]
// }
export function getBlogImage(imageKey?: string) {
  if (!imageKey) return officeImg

  // Supabase-backed posts store a full public URL in `image_key`
  if (/^https?:\/\//i.test(imageKey)) return imageKey

  // Legacy/static keys
  return blogImages[imageKey as keyof typeof blogImages] ?? officeImg
}
