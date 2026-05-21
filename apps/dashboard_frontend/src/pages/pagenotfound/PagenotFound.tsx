import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const PagenotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link to="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PagenotFound
