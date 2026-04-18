# Process JSON Contract

For each process, one JSON file can store:

- `process_id`
- `description`
- `input`
- `output`

The idea is to model not only the workflow logic, but also the business payload that flows through the process.

## Proposed structure

```json
{
  "process_id": "string",
  "process_name": "string",
  "description": "string",
  "input": {
    "channel": "email | erp_request | api_request | manual_entry",
    "sender": "string",
    "receiver": "string",
    "what_is_being_sent": {
      "business_object": "string",
      "fields": {
        "field_name": "value"
      },
      "attachments": [
        {
          "name": "string",
          "type": "string"
        }
      ]
    }
  },
  "output": {
    "channel": "email | erp_request | api_request | file_write",
    "sender": "string",
    "receiver": "string",
    "what_is_being_sent": {
      "business_object": "string",
      "fields": {
        "field_name": "value"
      },
      "attachments": [
        {
          "name": "string",
          "type": "string"
        }
      ]
    }
  }
}
```

## Notes

- `description` is the natural-language process description.
- `input` describes what enters the workflow.
- `output` describes what leaves the workflow.
- `what_is_being_sent` should be explicit enough that validators can compare workflow behavior against payload expectations.
- If a process has multiple inputs or outputs, this can later be extended from a single object to arrays.
