'use client';

import { Session } from 'next-auth';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from '@heroui/react';
import { IconBook, IconDoorExit, IconUserFilled } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { SearchBar } from './search';
import { getRoute } from '@/types/routes';
import { Link } from 'react-transition-progress/next';

export const Navbar = ({ session }: { session: Session }) => {
  return (
    <header className="p-6 flex justify-between sticky top-0 h-20 z-50 bg-beige">
      <Link href={getRoute('DASHBOARD')}>
        <h1 className="tracking-tighter italic text-xl">read-a-book</h1>
      </Link>

      <div className="flex items-center gap-4">
        <SearchBar />

        <Dropdown offset={16}>
          <DropdownTrigger>
            <Button size="sm" isIconOnly variant="light">
              <IconUserFilled className="text-oxford" />
            </Button>
          </DropdownTrigger>

          <DropdownMenu color="primary">
            <DropdownItem
              key="profile"
              className="mb-2"
              classNames={{ title: 'flex gap-3 items-center' }}
              href={`${getRoute('USER_SHORT')}${session.user.name}`}
            >
              <Image src={session.user.picture} alt="Profile pict" width={50} />

              <div>
                <h4 className="text-base font-semibold">
                  {session.user.nick ?? session.user.name}
                </h4>
                <p>@{session.user.name}</p>
              </div>
            </DropdownItem>

            <DropdownItem
              key="reading-list"
              href="/reading-list"
              startContent={<IconBook size={16} />}
            >
              Reading list
            </DropdownItem>

            <DropdownItem
              key="logout"
              startContent={<IconDoorExit size={16} />}
              color="danger"
              onPress={() => {
                signOut();
              }}
            >
              Log out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
};
