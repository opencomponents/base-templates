/* eslint-disable no-useless-escape */
'use strict';

const transformLoopWithLimit = require('../lib/transformLoopWithLimit');

describe('transformLoopWithLimit', () => {
  it('should be a function with arity 1', () => {
    expect(typeof transformLoopWithLimit).toBe('function');
    expect(transformLoopWithLimit.length).toBe(1);
  });

  describe('when invoked with an iteration limit', () => {
    const iterationLimit = 1000;
    const transformLoop = transformLoopWithLimit(iterationLimit);

    it('should return a function', () => {
      expect(typeof transformLoop).toBe('function');
    });

    const loopTypes = ['WhileStatement', 'ForStatement', 'DoWhileStatement'];

    loopTypes.concat('IfStatement').map(type => {
      describe(`and the result is invoked on a ${type} node`, () => {
        const nodeMock = {
          type: type,
          update: jest.fn(),
          source: jest.fn(() => 'while(true){}'),
          parent: {
            type: 'BlockStatement'
          }
        };

        transformLoop(nodeMock);

        if (loopTypes.indexOf(type) > -1) {
          it('should prepend a variable declaration with the right value assigned to it', () => {
            expect(nodeMock.update.mock.calls[0][0]).toContain('var __ITER = ');
            expect(nodeMock.update.mock.calls[0][0]).toContain(iterationLimit);
            expect(nodeMock.update.mock.calls[0].length).toBe(1);
          });
        } else {
          it("shouldn't update the node", () => {
            expect(nodeMock.update.mock.calls.length).toBe(0);
          });
        }
      });

      describe(`and the result is invoked on a labeled ${type} node`, () => {
        const labeledNodeMock = {
          type: type,
          parent: {
            type: 'LabeledStatement',
            update: jest.fn(),
            source: jest.fn(() => 'loop_label: while(true) {}')
          }
        };

        transformLoop(labeledNodeMock);

        if (loopTypes.indexOf(type) > -1) {
          it('should prepend a variable declaration with the right value assigned to it', () => {
            expect(labeledNodeMock.parent.update.mock.calls[0][0]).toContain(
              'var __ITER = '
            );
            expect(labeledNodeMock.parent.update.mock.calls[0][0]).toContain(
              iterationLimit
            );
            expect(labeledNodeMock.parent.update.mock.calls[0][0]).toContain(
              'loop_label'
            );
            expect(labeledNodeMock.parent.update.mock.calls[0].length).toBe(1);
          });
          it('should place the label AFTER the variable declaration', () => {
            let iterPosition = labeledNodeMock.parent.update.mock.calls[0][0].indexOf(
              'var __ITER = '
            );
            let labelPosition = labeledNodeMock.parent.update.mock.calls[0][0].indexOf(
              'loop_label'
            );
            expect(labelPosition).toBeGreaterThan(iterPosition);
          });
        } else {
          it("shouldn't update the node", () => {
            expect(labeledNodeMock.parent.update.mock.calls.length).toBe(0);
          });
        }
      });
    });

    describe('and the result is invoked on the body of loop', () => {
      const nodeMock = {
        type: 'BlockStatement',
        update: jest.fn(),
        source: jest.fn(() => '{x = 234}'),
        parent: {
          type: loopTypes[Math.floor(Math.random() * 3)]
        }
      };

      transformLoop(nodeMock);

      it('should update the body of the loop', () => {
        expect(nodeMock.update.mock.calls[0][0]).toBe(
          `{ if (__ITER <= 0) {
        throw new Error(\"Loop exceeded maximum allowed iterations\");
      }
      __ITER--;
      x = 234}`
        );
        expect(nodeMock.update.mock.calls[0].length).toBe(1);
      });
    });
  });
});
