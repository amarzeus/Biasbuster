
import React from 'react';
import { Badge } from '../types';
import { LockIcon, AwardIcon } from './icons/Icons';

interface BadgeCardProps {
    badge: Badge;
    isUnlocked: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isUnlocked }) => {
    const IconComponent = badge.icon;
    return (
        <div 
            className={`relative p-4 rounded-lg flex flex-col items-center justify-center text-center border-2 transition-all duration-300 group
            ${isUnlocked 
                ? 'bg-gold-accent/10 border-gold-accent/50 text-neutral-700 dark:text-neutral-200' 
                : 'bg-neutral-200/50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700 text-neutral-500'
            }`}
        >
             {isUnlocked ? 
                <IconComponent className="h-10 w-10 mb-2 text-gold-accent" /> :
                <LockIcon className="h-10 w-10 mb-2 text-neutral-400 dark:text-neutral-500" />
            }
            <p className={`font-bold text-sm ${isUnlocked ? 'text-neutral-800 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                {badge.name}
            </p>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 w-56 p-2 bg-neutral-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {badge.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-800"></div>
            </div>
        </div>
    );
};

interface BadgesProps {
    allBadges: Badge[];
    unlockedBadges: Set<string>;
}

const Badges: React.FC<BadgesProps> = ({ allBadges, unlockedBadges }) => {
    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
             <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center">
                <AwardIcon className="h-6 w-6 mr-3 text-trust-blue dark:text-ai-teal" />
                Your Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {allBadges.map(badge => (
                    <BadgeCard 
                        key={badge.id}
                        badge={badge}
                        isUnlocked={unlockedBadges.has(badge.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Badges;
