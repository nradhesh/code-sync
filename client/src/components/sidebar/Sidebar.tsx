import { useViews } from "@/context/ViewContext"
import useResponsive from "@/hooks/useResponsive"
import { VIEWS } from "@/types/view"
import { type ReactElement } from "react"
import ViewButton from "./sidebar-views/SidebarButton"

function Sidebar(): ReactElement {
    const {
        activeView,
        isSidebarOpen,
        viewComponents,
        viewIcons,
    } = useViews()
    const { minHeightReached } = useResponsive()

    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
            <div
                className={`fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-4 self-end overflow-hidden border-t border-darkHover bg-dark p-2 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4 ${
                    minHeightReached ? "hidden" : ""
                }`}
            >
                <ViewButton
                    viewName={VIEWS.FILES}
                    icon={viewIcons[VIEWS.FILES]}
                />
                <ViewButton
                    viewName={VIEWS.CHATS}
                    icon={viewIcons[VIEWS.CHATS]}
                />
                <ViewButton
                    viewName={VIEWS.COPILOT}
                    icon={viewIcons[VIEWS.COPILOT]}
                />
                <ViewButton
                    viewName={VIEWS.RUN}
                    icon={viewIcons[VIEWS.RUN]}
                />
                <ViewButton
                    viewName={VIEWS.CLIENTS}
                    icon={viewIcons[VIEWS.CLIENTS]}
                />
            </div>
            <div
                className="absolute left-0 top-0 z-20 w-full flex-col bg-dark md:static md:min-w-[300px]"
                style={isSidebarOpen ? {} : { display: "none" }}
            >
                {viewComponents[activeView]}
            </div>
        </aside>
    )
}

export default Sidebar
