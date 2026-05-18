import { Link } from 'react-router-dom'
import { blogPosts } from '../data/site'
import { formatBlogDate, getBlogCategories, getRecentPosts } from '../lib/blogHelpers'
import { getBlogImage } from '../lib/blogImages'

type BlogSidebarProps = {
  currentSlug: string
}

export default function BlogSidebar({ currentSlug }: BlogSidebarProps) {
  const recentPosts = getRecentPosts(currentSlug)
  const categories = getBlogCategories()

  return (
    <aside className="resources-sidebar resource-post-sidebar" aria-label="Blog sidebar">
      <div className="sidebar-widget">
        <h3>Recent posts</h3>
        <ul className="sidebar-recent">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link to={`/resources/${post.slug}`}>
                <img src={getBlogImage(post.imageKey)} alt="" />
                <div>
                  <strong>{post.title}</strong>
                  <time dateTime={post.date}>{formatBlogDate(post.date, true)}</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-widget">
        <h3>Categories</h3>
        <ul className="sidebar-categories sidebar-categories--links">
          <li>
            <Link to="/resources">
              <span>All articles</span>
              <span>({blogPosts.length})</span>
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
