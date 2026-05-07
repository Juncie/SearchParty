import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  )

  const toggleTheme = useCallback(() => {
    const nextIsDark = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', nextIsDark)
    setIsDark(nextIsDark)
  }, [])

  return (
    <div className="page-wrap rise-in space-y-4 py-8">
      <Button variant="outline" onClick={toggleTheme}>
        Theme: {isDark ? 'Dark' : 'Light'}
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <div className="my-2 h-px bg-border" />
        <CardFooter>
          <Button className="w-full">Click me</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
