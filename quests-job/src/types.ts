interface OneChoiceStep {
  type: 'one_choice';
  choices: string[];
  answer: [number];
}

interface MultipleChoiceStep {
  type: 'multiple_choice';
  choices: string[];
  answer: number[];
}

interface ConfirmOsmChangeStep {
  type: 'confirm_osm_change';
}

export interface Quest {
  remote: boolean;
  description: string;
  source?: string;
  name: string;
  category: 'trash' | 'fire' | 'water' | 'sewer' | 'electricity' | string;
  steps: (OneChoiceStep | MultipleChoiceStep | ConfirmOsmChangeStep)[];
  rewards: {
    experience: number;
    indicators?: {
      indicator: string;
      amount: number;
    }[];
    nft?: boolean;
  };
}

export interface QuestModel extends Quest {  
  id: string;
  expires_at: 'NEVER' | 'ONE_DAY' | 'HALF_DAY' | 'ONE_HOUR' | 'THREE_HOURS';
  shape: {
    shapeType: 'Circle';
    id: string;
    center: {
      lat: number;
      lng: number;
    };
    radius: number;
  };
}

export type Geojson = {
  features: {
    type: string;
    properties: any;
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }[];
};

export type Point = {
  type: 'Point';
  geometry: {
    coordinates: [number, number];
  };
  properties: any;
};
