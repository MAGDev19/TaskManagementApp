import React from 'react';

const SkeletonRow: React.FC = () => {
  return (
    <tr>
      <td colSpan={6}>
        <div className="my-1 h-10 w-full skeleton" />
      </td>
    </tr>
  );
};

export default SkeletonRow;