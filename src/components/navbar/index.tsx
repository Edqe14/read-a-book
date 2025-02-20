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
import { IconDoorExit, IconUserFilled } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import { SearchBar } from './search';
import Link from 'next/link';

export const Navbar = ({ session }: { session: Session }) => {
  return (
    <header className="p-6 flex justify-between">
      <Link href="/dashboard">
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

          <DropdownMenu color="secondary">
            <DropdownItem
              key="profile"
              isReadOnly
              className="mb-2"
              classNames={{ title: 'flex gap-3 items-center' }}
            >
              <Image src={session.user.picture} width={50} />

              <div>
                <h4 className="text-base font-semibold">{session.user.nick}</h4>
                <p>@{session.user.name}</p>
              </div>
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
