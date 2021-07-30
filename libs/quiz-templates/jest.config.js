module.exports = {
  name: 'quiz-templates',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/quiz-templates',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
