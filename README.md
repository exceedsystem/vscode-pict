# VSCode PICT

This extension generates pairwise test patterns using Microsoft PICT.

**Limitations:**

Currently, it works only on Microsoft Windows, but we hope to support Mac and Linux in the future.

## How to use?

1. Open a new text editor and create a test case for PICT as follows.

   ```
   #
   # This is a sample model for testing volume creation
   #

   Type:          Primary, Logical, Single, Span, Stripe, Mirror, RAID-5
   Size:          10, 100, 500, 1000, 5000, 10000, 40000
   Format method: quick, slow
   File system:   FAT, FAT32, NTFS
   Cluster size:  512, 1024, 2048, 4096, 8192, 16384, 32768, 65536
   Compression:   on, off
   ```

2. If you would like to specify a parameter arguments for PICT, specify it as is in the header comment section `# Options: `.

   ```
   #
   # This is a sample model for testing volume creation
   #
   # Options: /o:2 /d:, /a:| /n:~ /r:1 /c /s

   Type:          Primary, Logical, Single, Span, Stripe, Mirror, RAID-5
   Size:          10, 100, 500, 1000, 5000, 10000, 40000
   Format method: quick, slow
   File system:   FAT, FAT32, NTFS
   Cluster size:  512, 1024, 2048, 4096, 8192, 16384, 32768, 65536
   Compression:   on, off
   ```

   The following parameters can be used.

   ```
   Usage: pict model [options]

   Options:
     /o:N|max - Order of combinations (default: 2)
     /d:C     - Separator for values  (default: ,)
     /a:C     - Separator for aliases (default: |)
     /n:C     - Negative value prefix (default: ~)
     /e:file  - File with seeding rows
     /r[:N]   - Randomize generation, N - seed
     /c       - Case-sensitive model evaluation
     /s       - Show model statistics
   ```

3. Save the created test case with a name of your choice, such as 'test_pattern_001.txt'.
4. Please Open command palette and run `Run PICT` command.

   ![image](https://github.com/exceedsystem/vscode-pict/assets/70489172/7261b530-8618-4f37-9924-1549a7db8cd2)

5. After PICT is run, the generated test cases will be displayed in a new editor tab.

   ![image](https://github.com/exceedsystem/vscode-pict/assets/70489172/6fb4356b-1cba-4a37-bbda-8a27f3019fd3)

## References

**microsoft/pict**

https://github.com/microsoft/pict

**Learn how to write test case for PICT.**

https://github.com/Microsoft/pict/blob/main/doc/pict.md
