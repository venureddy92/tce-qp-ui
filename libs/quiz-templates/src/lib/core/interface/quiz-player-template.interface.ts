// import { QuizStimulus } from 'libs/question-bank/src/lib/question-bank/models/quiz-template/quiz-stimulus.model';
// import { QuizUI } from 'libs/question-bank/src/lib/question-bank/models/quiz-template/quiz-ui.model';

export interface TemplateMcqOption {
  label: string;
  value: string;
  selected: boolean;
  checked: boolean;
  feedbackInline: string;
  placeholder: string;
  image: string;
}

export interface TemplateMcqStem {
  text: string;
  value: string;
  placeholder: string;
}

export interface TemplateMcqData {
  reference: string;
  data: {
    shuffle: boolean;
    options: TemplateMcqOption[];
    stems: TemplateMcqStem[];
    possible_responses: Array<Array<string>>;
    stimulus: {
      label: string;
      value: string;
      feedbackInline: string;
      placeholder: string;
      imgMode: string;
      image: string;
      imageUrl: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<any>;
      };
      penalty: number;
    };
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
    media: {
      src: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}

export interface ClassifyMatchOption {
  label: string;
  value: string;
  direction: string;
  feedbackInline: string;
  placeholder: string;
  selected: boolean;
}

export interface TemplateClassifyMatchData {
  reference: string;
  data: {
    shuffle: boolean;
    options: ClassifyMatchOption[];
    possible_responses: ClassifyMatchOption[];
    stimulus: {
      label: string;
      value: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<string>;
      };
      penalty: number;
    };
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}

export interface ClassifyMatchStem {
  text: string;
  value: string;
}

export interface TemplateClassifyMatchListData {
  reference: string;
  data: {
    shuffle: boolean;
    options: ClassifyMatchOption[];
    possible_responses: ClassifyMatchOption[];
    matches: Array<Array<string>>;
    stems: ClassifyMatchStem[];
    stimulus: {
      label: string;
      value: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<string>;
      };
      penalty: number;
    };
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}

export interface TemplateClassifyGroupData {
  reference: string;
  data: {
    shuffle: boolean;
    options: ClassifyMatchOption[];
    // possible_responses: ClassifyMatchOption[];
    stimulus: {
      label: string;
      value: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<Array<string>>;
      };
      penalty: number;
    };
    rows: Array<string>;
    columns: Array<string>;
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}

export interface FibImageResponse {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

export interface FibImageOptions {
  label: string;
  value: string;
}

export interface FibImage {
  src: string;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface TemplateFibImage {
  reference: string;
  data: {
    image: FibImage;
    shuffle: boolean;
    options: FibImageOptions[];
    possible_responses: FibImageResponse[];
    responses: Array<FibImageOptions[]>;
    // possible_responses: ClassifyMatchOption[];
    stimulus: {
      label: string;
      value: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<any>;
      };
      penalty: number;
    };
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}

export interface shortText {
  reference: string;
  type: string;
  name: string;
  data: {
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        matching_rule: string;
        value: string;
      };
      penalty: number;
    };
    // stimulus: QuizStimulus;
    stimulus: {
      label: string;
      value: string;
      feedbackInline: string;
      imgMode: string;
      image: string;
      imageUrl: string;
    };
    // ui_style: QuizUI;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  show_copy: boolean;
  show_cut: boolean;
  show_paste: boolean;
  spellcheck: boolean;
  max_length: number;
  showSampleAnswer: boolean;
  show_word_limit: string;
  show_word_count: boolean;
  formatting_options: Array<string>;
  sample_answer: string;
}

export interface TemplateHotspot {
  reference: string;
  data: {
    image: FibImage;
    stimulus: {
      label: string;
      value: string;
    };
    type: string;
    areas: Array<Array<Point>>;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<string>;
      };
    };
    metadata: {
      name: string;
      template_reference: string;
    };
    // ui_style: QuizUI;
  };
  type: string;
  name: string;
}

export interface TemplateToken {
  reference: string;
  data: {
    stimulus: {
      label: string;
      value: string;
      feedbackInline: string;
    };
    type: string;
    template: string;
    templateText: string;
    tokens: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<string>;
      };
    };
    metadata: {
      name: string;
      template_reference: string;
    };
    // ui_style: QuizUI;
  };
  type: string;
  name: string;
}

export interface TemplateMultipleOption extends TemplateMcqOption {
  response: Array<string>;
}
export interface TemplateMultipleQuestionData {
  reference: string;
  data: {
    shuffle: boolean;
    options: TemplateMultipleOption[];
    stems: TemplateMcqStem[];
    default: number;
    optionsResponse: Array<Array<string>>;
    qstemResponse: Array<Array<string>>;
    possible_responses: Array<Array<string>>;
    stimulus: {
      label: string;
      value: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<string>;
      };
      penalty: number;
    };
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}

export interface FibTextDropdown {
  reference: string;
  data: {
    stems: TemplateMcqStem[];
    possible_responses: Array<any>;
    stimulus: {
      label: string;
      value: string;
      imgMode: string;
      imageUrl: string;
      image: string;
    };
    type: string;
    validation: {
      scoring_type: string;
      valid_response: {
        score: number;
        value: Array<any>;
      };
      penalty: number;
    };
    template: string;
    ui_style: {
      type: string;
      theme: string;
      _comment: string;
    };
    penalty_score: number;
    response_id: string;
    stimulus_audio: string;
    feedback_attempts: number;
    instant_feedback: boolean;
    _comment: string;
    metadata: {
      name: string;
      template_reference: string;
    };
  };
  type: string;
  name: string;
  widget_type: string;
}
