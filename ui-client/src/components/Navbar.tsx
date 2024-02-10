import {
  Navbar as Nav,
  NavbarBrand,
  //   NavbarContent,
  //   NavbarItem,
  //   Link,
  //   Button,
} from '@nextui-org/react';

export const Navbar = () => (
  <Nav isBordered>
    <NavbarBrand>
      <p className="font-bold text-inherit">ACME</p>
    </NavbarBrand>
    {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
      <NavbarItem>
        <Link color="foreground" href="#">
          Features
        </Link>
      </NavbarItem>
      <NavbarItem isActive>
        <Link href="#" aria-current="page">
          Customers
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link color="foreground" href="#">
          Integrations
        </Link>
      </NavbarItem>
    </NavbarContent> */}
  </Nav>
);
