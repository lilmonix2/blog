import siteMetadata from '@/data/siteMetadata'
import NavLinks from './NavLinks'
import Image from './Image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass = 'flex items-center w-full justify-between py-6 transition-colors duration-200'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md'
  } else {
    headerClass += ' bg-white dark:bg-gray-950'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Image
              src="/static/images/logo.png"
              alt="logo"
              className="h-12 w-12"
              sizes="48px"
              width={50}
              height={50}
            />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center gap-1 leading-5 sm:gap-2">
        <NavLinks />
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
