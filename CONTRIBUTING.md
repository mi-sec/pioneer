1. Fork repo into your account via GitHub UI
2. Clone user fork

    `git clone git@github.com:username/pioneer.git`
    
    `cd node`

3. Add original repo as `upstream`

    `git remote add upstream https://github.com/mi-sec/pioneer.git`

4. Fetch latest

    `git fetch upstream`

5. Ensure your git configuration is good to go

    `git config user.name "J. Random User"`
    
    `git config user.email "j.random.user@example.com"`

6. Create an issue on the upstream repo
7. Branch with that issue #

    `git checkout -b <branch> -t upstream/master`

8. Fix the issue!
9. Add files to commit

    `git add my/changed/files`

10. Commit (72 characters maximum line)

    `git commit`
    
    ```
    ------------------------------------------------------------------------
    subsystem: description of changes made
    
    More detail
    
    Fixes: https://github.com/mi-sec/pioneer/issue/1
    Refs: https://github.com/mi-sec/pioneer/pull/2
    ```

11. Fetch and Rebase

    `git fetch upstream`
    
    `git rebase upstream/master`

12. Push

    `git push origin <branch>`

13. Open Pull Request on the upstream repo
14. Make updates to the branch as necessary

    `git add my/changed/files`
    
    `git commit`
    
    `git push origin <branch>`

15. Synchronize your repo with upstream

    `git fetch --all`
    
    `git rebase origin/master`
    
    `git push --force-with-lease origin my-branch`

16. Done!
