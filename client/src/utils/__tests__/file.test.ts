import { describe, it, expect } from 'vitest';
import { findParentDirectory, isFileExist, getFileById, sortFileSystemItem } from '../file';
import { FileSystemItem } from '@/types/file';
import { v4 as uuidv4 } from 'uuid';

describe('File Utilities', () => {
    const testFileStructure: FileSystemItem = {
        id: '1',
        name: 'root',
        type: 'directory',
        children: [
            {
                id: '2',
                name: 'src',
                type: 'directory',
                children: [
                    {
                        id: '3',
                        name: 'index.js',
                        type: 'file',
                        content: 'console.log("test")'
                    }
                ]
            },
            {
                id: '4',
                name: 'test.js',
                type: 'file',
                content: 'test content'
            }
        ]
    };

    describe('findParentDirectory', () => {
        it('finds directory by id', () => {
            const result = findParentDirectory(testFileStructure, '2');
            expect(result).toBeTruthy();
            expect(result?.name).toBe('src');
        });

        it('returns null for non-existent directory', () => {
            const result = findParentDirectory(testFileStructure, 'nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('isFileExist', () => {
        it('returns true when file exists in directory', () => {
            const srcDir = testFileStructure.children![0];
            expect(isFileExist(srcDir, 'index.js')).toBe(true);
        });

        it('returns false when file does not exist', () => {
            const srcDir = testFileStructure.children![0];
            expect(isFileExist(srcDir, 'nonexistent.js')).toBe(false);
        });
    });

    describe('getFileById', () => {
        it('finds file by id', () => {
            const result = getFileById(testFileStructure, '3');
            expect(result).toBeTruthy();
            expect(result?.name).toBe('index.js');
        });

        it('returns null for non-existent file', () => {
            const result = getFileById(testFileStructure, 'nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('sortFileSystemItem', () => {
        it('sorts directories and files correctly', () => {
            const unsortedStructure: FileSystemItem = {
                id: uuidv4(),
                name: 'root',
                type: 'directory',
                children: [
                    { id: '1', name: 'c.js', type: 'file', content: '' },
                    { id: '2', name: '.env', type: 'file', content: '' },
                    { id: '3', name: 'b', type: 'directory', children: [] },
                    { id: '4', name: '.git', type: 'directory', children: [] },
                    { id: '5', name: 'a.js', type: 'file', content: '' }
                ]
            };

            const sorted = sortFileSystemItem(unsortedStructure);
            const sortedNames = sorted.children!.map(item => item.name);
            
            // Hidden directories should come first, then regular directories,
            // then hidden files, then regular files
            expect(sortedNames).toEqual(['.git', 'b', '.env', 'a.js', 'c.js']);
        });
    });
}); 