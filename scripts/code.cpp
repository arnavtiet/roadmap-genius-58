
#include <bits/stdc++.h>
using namespace std;

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;
    vector<long long> A(N);
    for (auto &x : A)
        cin >> x;

    array<int, 5> cnt{}; // counts of steps 1..4
    for (int i = 0, b; i < M; i++)
    {
        cin >> b;
        cnt[b]++;
    }

    const long long NEG = -9e18;
    // 4D dp[u1][u2][u3][u4]
    auto dp = vector<vector<vector<vector<long long>>>>(
        cnt[1] + 1,
        vector<vector<vector<long long>>>(
            cnt[2] + 1,
            vector<vector<long long>>(
                cnt[3] + 1,
                vector<long long>(cnt[4] + 1, NEG))));
    dp[0][0][0][0] = A[0];
    long long ans = A[0];

    for (int u1 = 0; u1 <= cnt[1]; u1++)
        for (int u2 = 0; u2 <= cnt[2]; u2++)
            for (int u3 = 0; u3 <= cnt[3]; u3++)
                for (int u4 = 0; u4 <= cnt[4]; u4++)
                {
                    long long cur = dp[u1][u2][u3][u4];
                    if (cur == NEG)
                        continue;
                    int pos = u1 + 2 * u2 + 3 * u3 + 4 * u4;
                    ans = max(ans, cur);

                    int used[5] = {0, u1, u2, u3, u4};
                    for (int step = 1; step <= 4; step++)
                    {
                        if (used[step] < cnt[step] && pos + step < N)
                        {
                            auto &ref = dp[u1 + (step == 1)][u2 + (step == 2)]
                                          [u3 + (step == 3)][u4 + (step == 4)];
                            ref = max(ref, cur + A[pos + step]);
                        }
                    }
                }

    cout << ans << "\n";
}