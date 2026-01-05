#include <bits/stdc++.h>

using namespace std;

int dice_roll()
{

    return rand() % 6 + 1;
}

int main()
{
    srand(time(0));

    //(99,10) (78,15) (63 , 17) (52 , 30)

    vector<pair<int, int>> snake = {{99, 10}, {78, 15}, {63, 17}, {52, 30}};
    vector<pair<int, int>> ladder = {{8, 26}, {50, 91}, {21, 82}, {43, 77}};
    int pos = 0;

    while (pos < 100)
    {
        cout << pos << " ";
        int delta = dice_roll();
        cout << " ( the die rolled to " << delta << " ) ";
        bool bite = false;
        bool climb = false;

        for (int i = 0; i < snake.size(); i++)
        {
            if (pos + delta == snake[i].first)
            {
                pos = snake[i].second;
                bite = true;
                cout << "snake cuts you  ";
                break;
            }
        }

        for (int i = 0; i < ladder.size(); i++)
        {
            if (pos + delta == ladder[i].first)
            {
                pos = ladder[i].second;
                climb = true;
                cout << "what a jump! ";
                break;
            }
        }

        if (!bite && !climb)
        {
            pos += delta;
        }

        cout << ": " << pos << "\n";

        if (pos >= 100)
            cout << "congrats you WON !!";
    }

    return 0;
}