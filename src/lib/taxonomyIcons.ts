import {
  Eye,
  BoundingBox,
  PersonSimpleWalk,
  Strategy,
  CirclesThree,
  GlobeHemisphereWest,
  ChartLine,
  Database,
  Tag,
  TrendUp,
  ChartScatter,
  Function as FunctionIcon,
  Code,
  GameController,
  Brain,
  Shield,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

/** Maps a taxonomy domain key to a Phosphor icon component. */
export const domainIcon: Record<string, Icon> = {
  llm: Brain,
  "computer-vision": Eye,
  "object-detection": BoundingBox,
  "pose-estimation": PersonSimpleWalk,
  "reinforcement-learning": Strategy,
  "self-supervised-learning": CirclesThree,
  "remote-sensing": GlobeHemisphereWest,
  "time-series": ChartLine,
  "data-engineering": Database,
  classification: Tag,
  regression: TrendUp,
  clustering: ChartScatter,
  "combinatorial-optimization": FunctionIcon,
  "software-engineering": Code,
  "game-dev": GameController,
  cybersecurity: Shield,
};
