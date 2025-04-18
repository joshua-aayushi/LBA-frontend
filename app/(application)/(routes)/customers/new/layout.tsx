import { Separator } from '@/components/ui/separator'
import { SideMenu } from './_components/side-menu'
import { sidebarNavItems } from '../_data/data'

interface AddCustomerLayoutProps {
  children: React.ReactNode
}


export default function AddCustomerLayout({ children }: AddCustomerLayoutProps){
  
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Add New Customer</h2>
        <p className="text-muted-foreground">
          Easily manage your customer details.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SideMenu items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}