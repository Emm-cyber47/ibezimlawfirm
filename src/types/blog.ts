export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author_name: string
  read_time: string
  image_key: string | null
  body: string[]
  date: string
  created_at: string
  updated_at: string
}