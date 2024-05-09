import React, { JSX } from 'react';
import { Sidebar } from '@tasker/sidebar';
import { CreatedTasks, MyTasks } from '@tasker/tasks-widgets';
import { getUserData } from '../api/auth/utils';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function Tasks(req: NextRequest): Promise<JSX.Element> {
  const cookieStore = cookies();
  const userData = getUserData(cookieStore);
  return (
    <div className="flex h-screen w-full">
      <div className="flex w-64 flex-col items-start justify-between border-r bg-white p-8">
        <Sidebar user={userData} />
      </div>
      <div className="w-full p-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="bg-white text-gray-900">
            <MyTasks />
          </div>
          <div className="bg-white text-gray-900">
            <CreatedTasks />
          </div>
        </div>
      </div>
    </div>
  );
}
