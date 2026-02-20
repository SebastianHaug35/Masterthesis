from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class N8nNode(BaseModel):
    name: str
    type: str
    typeVersion: int = 1
    position: List[float] = Field(default_factory=lambda: [0, 0])
    parameters: Dict[str, Any] = Field(default_factory=dict)
    credentials: Optional[Dict[str, Any]] = None

class N8nWorkflow(BaseModel):
    name: str = "Generated Workflow"
    nodes: List[N8nNode]
    connections: Dict[str, Any]
    active: bool = False
    settings: Dict[str, Any] = Field(default_factory=dict)
