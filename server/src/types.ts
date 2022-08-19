export interface Quest {
  remote: boolean;
  description: string;
  name: string;
  expires_at: 'NEVER' | 'ONE_DAY' | 'ONE_HOUR';
  category: 'trash' | 'fire' | 'water' | 'sewer' | 'electricity' | string;
  steps: {
    type: 'multiple_choice' | 'one_choice' | string;
    answer: number[];
    choices: string[];
  }[];
  rewards: {
    experience: number;
    indicators: {
      indicator: string;
      amount: number;
    }[];
  };
}

export interface QuestModel extends Quest {
  id: string;
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
