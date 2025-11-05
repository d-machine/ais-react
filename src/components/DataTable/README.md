# TanStack Table Integration

This folder contains reusable TanStack Table components that work seamlessly with your existing backend APIs.

## 📁 Files Overview

- **`DataTable.tsx`** - Main reusable table component
- **`SelectTable.tsx`** - Specialized table for selection/popup scenarios  
- **`columnUtils.tsx`** - Utilities for creating table columns from your config
- **`EntryListWithTable.tsx`** - Example implementation replacing the old EntryList

## 🚀 Quick Start

### 1. Basic Table Usage

```tsx
import { DataTable, createTableColumns } from '@components/DataTable';

function MyComponent() {
  const data = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ];

  const columns = createTableColumns([
    { name: 'id', label: 'ID', width: 100, sortable: true, filterType: 'number' },
    { name: 'name', label: 'Name', width: 200, sortable: true, filterType: 'text' },
    { name: 'email', label: 'Email', width: 250, sortable: false, filterType: 'text' },
  ]);

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting={true}
      onRowClick={(row, index) => console.log('Clicked:', row)}
    />
  );
}
```

### 2. Selection Table (for Popups)

```tsx
import { SelectTable } from '@components/DataTable';
import Modal from '@utils/Modal';

function SelectionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  
  const data = [/* your data */];
  const columns = [/* your column config */];

  const handleSelect = (selectedRows) => {
    console.log('Selected:', selectedRows);
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <SelectTable
        data={data}
        columns={columns}
        onSelect={handleSelect}
        onCancel={() => setIsOpen(false)}
        title="Select User"
        enableMultiSelect={false}
        enableSearch={true}
      />
    </Modal>
  );
}
```

### 3. Server-Side Sorting/Filtering

```tsx
import { DataTable, createTableColumns, convertToApiSorting } from '@components/DataTable';
import { SortingState } from '@tanstack/react-table';

function ServerSideTable() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const fetchData = async (sortData?: any) => {
    const response = await postApiCall('/api/generic/executeQuery', {
      configFile: 'myConfig',
      fetchQuery: { sortData }
    }, true);
    setData(response.data);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    const apiSorting = convertToApiSorting(newSorting);
    fetchData(apiSorting);
  };

  const columns = createTableColumns(list_config.columns);

  return (
    <DataTable
      data={data}
      columns={columns}
      sortingState={sorting}
      onSortingChange={handleSortingChange}
      manualSorting={true}
      enableSorting={true}
    />
  );
}
```

## 📋 Component Props

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | required | Array of data objects |
| `columns` | `ColumnDef<TData>[]` | required | Column definitions |
| `onRowClick` | `(row, index) => void` | - | Callback when row is clicked |
| `onRowDoubleClick` | `(row, index) => void` | - | Callback when row is double-clicked |
| `selectedRowIndex` | `number` | - | Index of selected row |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableFiltering` | `boolean` | `false` | Enable column filtering |
| `enablePagination` | `boolean` | `false` | Enable pagination |
| `enableRowSelection` | `boolean` | `false` | Enable row selection |
| `enableMultiRowSelection` | `boolean` | `false` | Enable multi-row selection |
| `pageSize` | `number` | `10` | Number of rows per page |
| `isLoading` | `boolean` | `false` | Show loading state |
| `emptyMessage` | `string` | `'No data available'` | Message when no data |
| `onSortingChange` | `(sorting) => void` | - | Callback when sorting changes |
| `onSelectionChange` | `(rows) => void` | - | Callback when selection changes |
| `manualSorting` | `boolean` | `false` | Use server-side sorting |
| `sortingState` | `SortingState` | - | Controlled sorting state |

### SelectTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | required | Array of data objects |
| `columns` | `Column[]` | required | Your existing column config |
| `onSelect` | `(rows) => void` | required | Callback when selection confirmed |
| `onCancel` | `() => void` | required | Callback when cancelled |
| `title` | `string` | `'Select Items'` | Popup title |
| `enableMultiSelect` | `boolean` | `false` | Allow multiple selections |
| `enableSearch` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `confirmButtonText` | `string` | `'Select'` | Confirm button text |
| `cancelButtonText` | `string` | `'Cancel'` | Cancel button text |
| `isLoading` | `boolean` | `false` | Show loading state |
| `maxHeight` | `string` | `'500px'` | Maximum table height |
| `enableSorting` | `boolean` | `true` | Enable column sorting |

## 🔧 Utility Functions

### `createTableColumns(columns, options)`

Creates TanStack Table column definitions from your existing column configuration.

```tsx
const columns = createTableColumns(list_config.columns, {
  enableSorting: true,
  enableFiltering: true,
  onCellClick: (row, column, value) => {
    console.log('Cell clicked:', row, column, value);
  },
  cellRenderer: (column, value, row) => {
    // Custom cell rendering
    if (column === 'status') {
      return <span className={`status-${value}`}>{value}</span>;
    }
    return value;
  }
});
```

### `createSelectionColumn()`

Creates a checkbox column for row selection.

```tsx
const columns = [
  createSelectionColumn(),
  ...otherColumns
];
```

### `convertToApiSorting(sorting)`

Converts TanStack Table sorting state to your API format.

```tsx
const tanstackSorting = [{ id: 'name', desc: false }];
const apiSorting = convertToApiSorting(tanstackSorting);
// Returns: [{ field: 'name', order: 'asc' }]
```

### `convertSortingState(sortData)`

Converts your API sort format to TanStack Table format.

```tsx
const apiSort = [{ field: 'name', order: 'asc' }];
const tanstackSort = convertSortingState(apiSort);
// Returns: [{ id: 'name', desc: false }]
```

## 🎨 Styling

The components use CSS modules for styling. You can customize by:

1. **Override CSS classes**: Import and extend the CSS modules
2. **Pass className prop**: Add custom classes to the container
3. **Inline styles**: Use the existing style props

## 📝 Integration with Your Backend

The components are designed to work with your existing API structure:

```tsx
// Your backend expects:
{
  configFile: string,
  fetchQuery: {
    sortData?: [{ field: string, order: 'asc' | 'desc' }],
    filtersData?: [{ field: string, value: string, operator: string }],
    paginationData?: { offset: number, limit: number }
  }
}

// TanStack Table provides sorting in this format:
[{ id: string, desc: boolean }]

// Use convertToApiSorting() to convert:
const apiFormat = convertToApiSorting(tanstackSorting);
```

## 🔄 Migration from Old Table

To migrate from your old table implementation:

1. Replace import:
```tsx
// Old
import EntryList from '@components/EntryList';

// New
import EntryListWithTable from '@components/EntryList/EntryListWithTable';
```

2. The new component maintains the same props and behavior
3. All your existing API calls work without changes
4. Server-side sorting/filtering is fully supported

## 💡 Examples

See `EntryListWithTable.tsx` for a complete example of:
- Server-side sorting and filtering
- Row selection
- Action buttons
- Modal integration
- Backend API integration

## 🐛 Troubleshooting

**Table not rendering?**
- Check that `data` is an array
- Verify column names match your data keys

**Sorting not working?**
- Set `manualSorting={true}` for server-side sorting
- Set `manualSorting={false}` or omit for client-side sorting

**Selection not working?**
- Enable with `enableRowSelection={true}`
- Use `enableMultiRowSelection` for multiple selections
- Listen to `onSelectionChange` callback

## 🔍 SelectTable Sorting Behavior

The **SelectTable** component implements **client-side sorting**:
- Data is sorted in-memory after filtering by search term
- Supports sorting by string, number, and other data types
- Handles null/undefined values gracefully
- Multi-column sorting supported
- Click column headers to sort (asc → desc → unsorted)

This is different from **DataTable** which supports both client-side and server-side sorting via the `manualSorting` prop.

## 📚 Resources

- [TanStack Table Docs](https://tanstack.com/table/latest/docs/introduction)
- [TanStack Table Examples](https://tanstack.com/table/latest/docs/framework/react/examples/basic)
