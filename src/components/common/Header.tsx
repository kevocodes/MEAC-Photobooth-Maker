import { PublicRoutes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  return (
    <header className="text-muted-foreground text-center p-4 sticky top-0 z-10 h-14 bg-background/60 backdrop-blur-sm backdrop-filter">
      <nav>
        <ul className="flex justify-center gap-4">
          <li>
            <Link
              to={PublicRoutes.Home}
              className={cn(
                "font-bold hover:bg-muted p-2 rounded-md relative",
                location.pathname === PublicRoutes.Home &&
                  " after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-primary"
              )}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to={PublicRoutes.PrintedPhotos}
              className={cn(
                "font-bold hover:bg-muted p-2 rounded-md relative",
                location.pathname === PublicRoutes.PrintedPhotos &&
                  " after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-primary"
              )}
            >
              Fotos Impresas
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
