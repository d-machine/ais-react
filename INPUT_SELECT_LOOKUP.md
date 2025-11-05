# InputSelectLookup - Lookup Field with Table Selection

## Overview

New component that provides a lookup field with a modal table for selection. When configured with `selectConfig`, the SELECT input type will automatically use a table-based selection interface instead of a dropdown.

## How It Works

1. **Input Field**: Shows a read-only text input with the selected display value
2. **Activation**: Double-click or press Enter to open the selection modal
3. **Table Selection**: Modal shows a DataTable with all available options
4. **Field Extraction**: On row selection, extracts and populates multiple fields based on configuration
5. **Clear Button**: ✕ button appears when a value is selected to clear the selection

## Configuration

### YAML Config Example (add-state.yaml)

```yaml
fields:
  - name: country_id
    label: Country
    type: SELECT
    required: true
    multi: false
    selectConfig:
      resource: list-countries              # Config file for the lookup table
      selectHandler: converter              # How to handle selection
      currentSelection:                     # Fields shown in input
        - key: country_id
          as: country_id
      selectParser: converter               # How to parse selection
      fields_to_extract:                    # Fields to extract from selected row
        - key: country_id
          as: country_id
        - key: country_name
          as: country_name
```

### Key Properties

**selectConfig.resource**: 
- The config file name (e.g., `list-countries`)
- Must be a valid list config that DataTableContainer can load
- Should define columns and query for the lookup table

**selectConfig.fields_to_extract**:
- Array of field mappings
- `key`: Field name in the selected row data
- `as`: Field name in the form data
- Automatically populates multiple form fields from one selection

**selectConfig.currentSelection**:
- Defines which field(s) to display in the input
- Usually maps to the "name" field for display

## User Experience

### Normal Input State
```
┌─────────────────────────────────────┐
│ Country                             │
│ ┌─────────────────────────────────┐│
│ │ United States              ✕    ││  ← Display value + Clear button
│ └─────────────────────────────────┘│
│ Double-click or press Enter to select Country
└─────────────────────────────────────┘
```

### Modal Table Selection
```
┌──────────────────────────────────────────────┐
│  Select Country                          ✕   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │ Country ID │ Country Name │ Code   │   │
│  ├────────────┼──────────────┼────────┤   │
│  │ 1          │ United States│ US     │   │
│  │ 2          │ Canada       │ CA     │   │
│  │ 3          │ Mexico       │ MX     │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  Click any row to select                     │
│                                              │
│                          [Cancel]            │
└──────────────────────────────────────────────┘
```

## Technical Implementation

### Component Flow

1. **InputSelect.tsx**: 
   - Detects `selectConfig` prop
   - Routes to `InputSelectLookup` component

2. **InputSelectLookup.tsx**:
   - Renders input field with double-click/Enter handlers
   - Fetches lookup table config when modal opens
   - Uses `DataTableContainer` to render the table
   - Extracts fields and updates form on row selection

3. **TanStackForm.tsx**:
   - Passes `selectConfig` from field definition to InputSelect
   - Form state updates automatically when fields are extracted

### Data Flow

```
Config (YAML)
    ↓
TanStackForm
    ↓
InputSelect (detects selectConfig)
    ↓
InputSelectLookup
    ↓
Modal + DataTableContainer
    ↓
Row Selection
    ↓
Extract fields_to_extract
    ↓
Update form via setFormData
```

## Features

### ✅ Implemented

- Double-click to open modal
- Enter key to open modal
- Table-based selection with TanStack Table
- Multi-field extraction from selected row
- Clear button to reset selection
- Display value from selected data
- Loading states
- Modal with cancel button
- Disabled/read-only support

### 🎯 Usage Scenarios

1. **Foreign Key Selection**: Select country for state, customer for order, etc.
2. **Complex Lookups**: When you need to see multiple fields before selecting
3. **Large Option Lists**: Better UX than dropdown for 100+ options
4. **Multi-Field Population**: Automatically fill related fields from one selection

## Example Use Cases

### 1. State → Country Lookup
```yaml
- name: country_id
  type: SELECT
  selectConfig:
    resource: list-countries
    fields_to_extract:
      - key: country_id
        as: country_id
      - key: country_name
        as: country_name
```
**Result**: Selecting a country populates both `country_id` and `country_name` in the form.

### 2. Order → Customer Lookup
```yaml
- name: customer_id
  type: SELECT
  selectConfig:
    resource: list-customers
    fields_to_extract:
      - key: customer_id
        as: customer_id
      - key: customer_name
        as: customer_name
      - key: customer_email
        as: customer_email
      - key: customer_phone
        as: customer_phone
```
**Result**: Selecting a customer populates ID, name, email, and phone.

### 3. Product → Category Lookup
```yaml
- name: category_id
  type: SELECT
  selectConfig:
    resource: list-categories
    fields_to_extract:
      - key: category_id
        as: category_id
      - key: category_name
        as: category_name
      - key: parent_category_id
        as: parent_category_id
```
**Result**: Selecting a category populates category info including parent.

## Backend Requirements

The `resource` config file (e.g., `list-countries.yaml`) must be a valid list config with:

1. **columns**: Define what columns to show in the lookup table
2. **queryInfo**: Query to fetch the lookup data
3. Standard list config structure

Example `list-countries.yaml`:
```yaml
queryInfo:
  returnType: MULTIPLE_ROWS
  query: |
    SELECT 
      id as country_id,
      name as country_name,
      code as country_code
    FROM wms.country
    ORDER BY name
columns:
  - name: country_id
    label: ID
    width: 80
    sortable: true
  - name: country_name
    label: Country Name
    width: 200
    sortable: true
  - name: country_code
    label: Code
    width: 80
    sortable: true
```

## Benefits Over Standard Dropdown

| Feature | Standard SELECT | InputSelectLookup |
|---------|----------------|-------------------|
| Large lists | Cluttered dropdown | Clean table with sorting/filtering |
| Multi-column display | Single column | All relevant columns visible |
| Searching | Basic browser search | Full table filtering |
| Sorting | No sorting | Click headers to sort |
| Field extraction | Single value only | Multiple fields extracted |
| UX for 100+ items | Poor | Excellent |

## Testing

To test the implementation:

1. Open the State form (Add State)
2. Click on the Country field
3. Double-click or press Enter
4. Modal should open showing countries table
5. Click any country row
6. Modal closes and country name appears in the input
7. Check that `country_id` and `country_name` are both populated in form data

## Summary

✅ Created `InputSelectLookup.tsx` component
✅ Updated `InputSelect.tsx` to route to lookup when `selectConfig` present
✅ Updated `TanStackForm.tsx` to pass `selectConfig` prop
✅ Uses existing `DataTableContainer` for table rendering
✅ Supports multi-field extraction via `fields_to_extract`
✅ Works with your existing backend API structure

**The feature is ready to use! Configure any SELECT field with `selectConfig` to enable lookup table selection.**
