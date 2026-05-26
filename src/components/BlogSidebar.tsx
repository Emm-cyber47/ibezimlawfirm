// import { Link } from 'react-router-dom'
// import { blogPosts } from '../data/site'
// import { formatBlogDate, getBlogCategories, getRecentPosts } from '../lib/blogHelpers'
// import { getBlogImage } from '../lib/blogImages'

// type BlogSidebarProps = {
//   currentSlug: string
// }

// export default function BlogSidebar({ currentSlug }: BlogSidebarProps) {
//   const recentPosts = getRecentPosts(currentSlug)
//   const categories = getBlogCategories()

//   return (
//     <aside className="resources-sidebar resource-post-sidebar" aria-label="Blog sidebar">
//       <div className="sidebar-widget luxe-card">
//         <span className="luxe-card-shine" aria-hidden />
//         <h3>Recent posts</h3>
//         <ul className="sidebar-recent">
//           {recentPosts.map((post) => (
//             <li key={post.slug}>
//               <Link to={`/resources/${post.slug}`}>
//                 <img src={getBlogImage(post.imageKey)} alt="" />
//                 <div>
//                   <strong>{post.title}</strong>
//                   <time dateTime={post.date}>{formatBlogDate(post.date, true)}</time>
//                 </div>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="sidebar-widget luxe-card">
//         <span className="luxe-card-shine" aria-hidden />
//         <h3>Categories</h3>
//         <ul className="sidebar-categories sidebar-categories--links">
//           <li>
//             <Link to="/resources">
//               <span>All articles</span>
//               <span>({blogPosts.length})</span>
//             </Link>
//           </li>
//           {categories.map(([name, count]) => (
//             <li key={name}>
//               <Link to={`/resources?category=${encodeURIComponent(name)}`}>
//                 <span>{name}</span>
//                 <span>({count})</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <Link to="/resources" className="btn btn-navy resource-post-all-link">
//         Browse all articles
//       </Link>
//     </aside>
//   )
// }


import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'
import { formatBlogDate } from '../lib/blogHelpers'
import { getBlogImage } from '../lib/blogImages'

type BlogPost = {
  id: string
  slug: string
  title: string
  date: string
  category: string
  image_key: string
}

type BlogSidebarProps = {
  currentSlug: string
}

export default function BlogSidebar({ currentSlug }: BlogSidebarProps) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      const supabase = getSupabase()
      if (!supabase) return

      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, date, category, image_key')
        .order('date', { ascending: false })

      if (error) {
        console.error(error)
        setPosts([])
        return
      }

      setPosts(data ?? [])
    }

    void fetchPosts()
  }, [])

  const recentPosts = useMemo(() => {
    const safePosts = posts ?? []
    return safePosts.filter((p) => p.slug !== currentSlug).slice(0, 4)
  }, [posts, currentSlug])

  const categories = useMemo(() => {
    const safePosts = posts ?? []
    const categoriesMap = new Map<string, number>()

    safePosts.forEach((post) => {
      categoriesMap.set(post.category, (categoriesMap.get(post.category) ?? 0) + 1)
    })

    return Array.from(categoriesMap.entries())
  }, [posts])

  return (
    <aside className="resources-sidebar resource-post-sidebar">
      <div className="sidebar-widget luxe-card">
        <h3>Recent posts</h3>

        <ul className="sidebar-recent">
          {(recentPosts ?? []).map((post) => (
            <li key={post.id}>
              <Link to={`/resources/${post.slug}`}>
                <img src={getBlogImage(post.image_key)} alt="" />
                <div>
                  <strong>{post.title}</strong>
                  <time>{formatBlogDate(post.date, true)}</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {posts === null && <div style={{ padding: '0.75rem 0.25rem' }}>Loading…</div>}
      </div>

      <div className="sidebar-widget luxe-card">
        <h3>Categories</h3>

        <ul className="sidebar-categories sidebar-categories--links">
          <li>
            <Link to="/resources">
              <span>All articles</span>
              <span>({posts?.length ?? 0})</span>
            </Link>
          </li>

          {categories.map(([name, count]) => (
            <li key={name}>
              <Link to={`/resources?category=${encodeURIComponent(name)}`}>
                <span>{name}</span>
                <span>({count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/resources" className="btn btn-navy resource-post-all-link">
        Browse all articles
      </Link>
    </aside>
  )
}
