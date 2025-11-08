export const TableRowSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="h-4 w-8 bg-gray-200 rounded" />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="h-10 w-10 bg-gray-200 rounded-full" />
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </td>
    </tr>
  );
};
