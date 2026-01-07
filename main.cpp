#include <bits/stdc++.h>
using namespace std;

#define RESET   "\033[0m"
#define RED     "\033[31m"
#define GREEN   "\033[32m"
#define YELLOW  "\033[33m"
#define BLUE    "\033[34m"

int dice_roll()
{
    return rand() % 6 + 1;
}

int main()
{
    srand(time(0));

    vector<pair<int, int>> snake = {{99, 10}, {78, 15}, {63, 17}, {52, 30}};
    vector<pair<int, int>> ladder = {{8, 26}, {50, 91}, {21, 82}, {43, 77}};
    int pos = 0;
    bool gameRunning= true; 

    while (gameRunning)
    {
        cout << BLUE << pos  << RESET << "----";
        int delta = dice_roll();
        cout << "--(the die rolled to: " << delta << ")--";
        bool bite = false;
        bool climb = false;

        for (int i = 0; i < snake.size(); i++)
        {
            if (pos + delta == snake[i].first)
            {
                pos = snake[i].second;
                bite = true;
                cout << RED << "--[snake cuts you]--" << RESET;
                break;
            }
        }

        for (int i = 0; i < ladder.size(); i++)
        {
            if (pos + delta == ladder[i].first)
            {
                pos = ladder[i].second;
                climb = true;
                cout << YELLOW << "--[what a jump!]--" << RESET;
                break;
            }
        }

        if (!bite && !climb)
        {
            if(pos+delta > 100) {
                pos+=0;
            } else if(pos+delta == 100) {
                cout << "{congrats you WON !!}";
                pos+= delta;
                gameRunning = false;
            } else {
                pos += delta;
            }
        }

        cout << "--->" << GREEN << pos << RESET << "\n";
    }

    return 0;
}